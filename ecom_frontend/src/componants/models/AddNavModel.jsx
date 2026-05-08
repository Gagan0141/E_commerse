import React from "react";

export default function NavModals({
  activeModal,
  closenavModal,
  form,
  setForm,
  handleSubmit,
  loading,
  categories,
}) {
  if (activeModal !== "nav") return null;

  const handleCategoryChange = (categoryId) => {
    const exists = form?.categories?.includes(categoryId);
    if (exists) {
      setForm({
        ...form,
        categories: (form.categories || []).filter((id) => id !== categoryId),
      });
    } else {
      setForm({
        ...form,
        categories: [...(form.categories || []), categoryId],
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50 backdrop-blur-sm">
      <div className="w-[40%] bg-white shadow-lg p-8 rounded-2xl">
        <div className="w-full flex justify-end">
          <button onClick={closenavModal} className="rounded-md px-2 text-xl">
            ✕
          </button>
        </div>

        <h1 className="text-3xl text-center mb-6">Add Navigation</h1>

        <form onSubmit={handleSubmit}>
          {/* Nav Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Navigation Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Categories */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Select Categories
            </label>

            <div className="max-h-52 overflow-y-auto border rounded p-3 space-y-2">
              {categories.map((category) => (
                <label key={category._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form?.categories?.includes(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                  />
                  {category.title}
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="bg-green-400 rounded-md p-2 px-5 hover:bg-green-500"
            >
              {loading ? "adding..." : "ADD"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
