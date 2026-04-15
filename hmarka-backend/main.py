import os
import shutil
import uuid
from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

from database import engine, Base, get_db
import models
import schemas

# Створюємо таблиці в БД автоматично (для мінімального сетапу)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Headless CMS Backend")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/upload/")
def upload_image(file: UploadFile = File(...)):
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ""
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"http://127.0.0.1:8000/uploads/{unique_filename}"}

@app.post("/users/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(username=user.username, password_hash=user.password)
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="User with this username already exists")

@app.post("/posts/", response_model=schemas.PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(post: schemas.PostCreate, db: Session = Depends(get_db)):
    # Перевірка на вже існуючий slug
    existing_post = db.query(models.Post).filter(models.Post.slug == post.slug).first()
    if existing_post:
        raise HTTPException(status_code=400, detail="Post with this slug already exists")
        
    db_post = models.Post(**post.model_dump())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@app.get("/posts/", response_model=List[schemas.PostResponse])
def read_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    posts = db.query(models.Post).offset(skip).limit(limit).all()
    return posts

@app.get("/posts/category/{category_name}", response_model=List[schemas.PostResponse])
def read_posts_by_category(category_name: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    posts = db.query(models.Post).filter(models.Post.category == category_name).offset(skip).limit(limit).all()
    return posts

@app.get("/posts/{slug}", response_model=schemas.PostResponse)
def read_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.slug == slug).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return post
