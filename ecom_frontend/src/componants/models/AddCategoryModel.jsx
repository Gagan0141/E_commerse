import React from "react";

export default function categorymodal({
  activeModal,
  closecategoryModal,
  form,
  setForm,
  handleSubmit,
  loading,
}) {
  if (activeModal !== "cat") return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
      <div className="w-[40%] bg-white shadow-lg p-8 rounded-2xl transform transition-all duration-300 ease-in-out scale-100 opacity-100">
        <div className="w-full flex justify-end ">
          <button
            onClick={closecategoryModal}
            className="rounded-md px-2 text-xl"
          >
            ✕
          </button>
        </div>

        <h1 className="text-3xl text-center mb-6">Add Category</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
              }}
              className="w-full p-2 border rounded"
              required
            />
          </div>

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
