import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function BookForm({ initial, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initial || {
      title: "",
      author: "",
      isbn: "",
      category: "",
      copies_total: 1,
      copies_available: 1,
    },
  });

  const handleIncrement = (field, min = 0) => {
    const currentValue = watch(field) || 0;
    setValue(field, currentValue + 1);
  };

  const handleDecrement = (field, min = 0) => {
    const currentValue = watch(field) || 0;
    if (currentValue > min) {
      setValue(field, currentValue - 1);
    }
  };

  useEffect(() => {
    reset(
      initial || {
        title: "",
        author: "",
        isbn: "",
        category: "",
        copies_total: 1,
        copies_available: 1,
      }
    );
  }, [initial, reset]);

  return (
    <form className="form grid" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <input
          placeholder="Title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </div>
      <div className="form-group">
        <input
          placeholder="Author"
          {...register("author", { required: "Author is required" })}
        />
        {errors.author && <span className="error">{errors.author.message}</span>}
      </div>
      <div className="form-group">
        <input
          placeholder="ISBN"
          {...register("isbn", { required: "ISBN is required" })}
        />
        {errors.isbn && <span className="error">{errors.isbn.message}</span>}
      </div>
      <div className="form-group">
        <input
          placeholder="Category"
          {...register("category", { required: "Category is required" })}
        />
        {errors.category && <span className="error">{errors.category.message}</span>}
      </div>
      <div className="form-group">
        <label>
          <span>Total Copies</span>
          <div className="number-input-wrapper">
            <button
              type="button"
              className="number-btn decrement"
              onClick={() => handleDecrement("copies_total", 1)}
            >
              −
            </button>
            <input
              type="number"
              min={1}
              className="number-input"
              {...register("copies_total", {
                required: "Total copies is required",
                valueAsNumber: true,
                min: { value: 1, message: "Must be at least 1" },
              })}
            />
            <button
              type="button"
              className="number-btn increment"
              onClick={() => handleIncrement("copies_total", 1)}
            >
              +
            </button>
          </div>
        </label>
        {errors.copies_total && (
          <span className="error">{errors.copies_total.message}</span>
        )}
      </div>
      <div className="form-group">
        <label>
          <span>Available Copies</span>
          <div className="number-input-wrapper">
            <button
              type="button"
              className="number-btn decrement"
              onClick={() => handleDecrement("copies_available", 0)}
            >
              −
            </button>
            <input
              type="number"
              min={0}
              className="number-input"
              {...register("copies_available", {
                required: "Available copies is required",
                valueAsNumber: true,
                min: { value: 0, message: "Cannot be negative" },
              })}
            />
            <button
              type="button"
              className="number-btn increment"
              onClick={() => handleIncrement("copies_available", 0)}
            >
              +
            </button>
          </div>
        </label>
        {errors.copies_available && (
          <span className="error">{errors.copies_available.message}</span>
        )}
      </div>
      <div className="actions">
        <button className="btn" type="submit">
          Save
        </button>
        {onCancel && (
          <button className="btn ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
