import enum

from sqlalchemy import Column, DateTime, Enum, Integer, String, func
from sqlalchemy.orm import relationship
from passlib.hash import pbkdf2_sha256, bcrypt_sha256, bcrypt

from . import Base


class UserRole(enum.Enum):
    member = "member"
    librarian = "librarian"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole, native_enum=False, length=50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    borrowings = relationship("Borrowing", back_populates="member", cascade="all, delete-orphan")

    def set_password(self, raw_password: str) -> None:
        # Use pbkdf2_sha256 to avoid bcrypt 72-byte limits and backend quirks
        self.password_hash = pbkdf2_sha256.hash(raw_password)

    def verify_password(self, raw_password: str) -> bool:
        # Try primary scheme first; fall back to legacy hashes if they exist
        try:
            return pbkdf2_sha256.verify(raw_password, self.password_hash)
        except ValueError:
            pass
        try:
            return bcrypt_sha256.verify(raw_password, self.password_hash)
        except ValueError:
            pass
        try:
            return bcrypt.verify(raw_password, self.password_hash)
        except ValueError:
            return False


__all__ = ["User", "UserRole"]
