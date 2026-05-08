import React from "react";

export default function NavModals({
  activeModal,
  closenavModal,
  form,
  setForm,
  handleSubmit,
  loading,
}) {
  if (activeModal !== "nav") return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
      <div className="w-[40%] bg-white shadow-lg p-8 rounded-2xl transform transition-all duration-300 ease-in-out scale-100 opacity-100">
        <div className="w-full flex justify-end ">
          <button onClick={closenavModal} className="rounded-md px-2 text-xl">
            ✕
          </button>
        </div>

        <h1 className="text-3xl text-center mb-6">Add Nav Icon</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Icon Name</label>
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

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Icon image</label>
            <input
              type="url"
              value={form.imgurl}
              onChange={(e) => {
                setForm({ ...form, imgurl: e.target.value });
              }}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">link to the tab</label>
            <input
              type="text"
              value={form.path}
              onChange={(e) => {
                setForm({ ...form, path: e.target.value });
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
