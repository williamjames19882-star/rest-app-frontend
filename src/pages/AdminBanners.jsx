import React, { useEffect, useState } from 'react';
import { adminAPI } from '../api/api';

const initialForm = {
  title: '',
  subtitle: '',
  image: null,
  is_active: true,
  position: 0,
};

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null); // banner object
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(''), 3500);
      return () => clearTimeout(t);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(''), 2500);
      return () => clearTimeout(t);
    }
  }, [success]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllBanners();
      setBanners(res.data || []);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setForm((f) => ({ ...f, image: files && files[0] ? files[0] : null }));
    } else if (type === 'checkbox') {
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (name === 'position') {
      setForm((f) => ({ ...f, position: Number(value) || 0 }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm(initialForm);
  };

  const onEdit = (banner) => {
    setEditing(banner);
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image: null,
      is_active: !!banner.is_active,
      position: banner.position || 0,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('subtitle', form.subtitle);
      fd.append('is_active', form.is_active ? '1' : '0');
      fd.append('position', String(form.position || 0));
      if (form.image) fd.append('image', form.image);

      if (editing) {
        await adminAPI.updateBanner(editing.id, fd);
        setSuccess('Banner updated');
      } else {
        if (!form.image) {
          setError('Image is required');
          return;
        }
        await adminAPI.createBanner(fd);
        setSuccess('Banner created');
      }
      await fetchBanners();
      resetForm();
    } catch (e2) {
      setError(e2.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await adminAPI.deleteBanner(id);
      setSuccess('Banner deleted');
      await fetchBanners();
      if (editing && editing.id === id) resetForm();
    } catch (e) {
      setError(e.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Manage Banners</h1>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-800">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800">{success}</div>
      )}

      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-4 mb-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Optional title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input
              name="subtitle"
              value={form.subtitle}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Optional subtitle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Active</label>
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={onChange}
              className="h-5 w-5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <input
              type="number"
              name="position"
              value={form.position}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              min="0"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Image {editing ? '(leave empty to keep current)' : ''}</label>
            <input type="file" name="image" accept="image/*" onChange={onChange} />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : editing ? 'Update Banner' : 'Create Banner'}
          </button>
          {editing && (
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded border">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Preview</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Subtitle</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6" colSpan={6}>Loading...</td>
                </tr>
              ) : banners.length ? (
                banners.map((b) => (
                  <tr key={b.id} className="border-t">
                    <td className="px-4 py-2">
                      <img src={b.image_url} alt="banner" className="h-12 w-20 object-cover rounded" />
                    </td>
                    <td className="px-4 py-2">{b.title || '-'}</td>
                    <td className="px-4 py-2">{b.subtitle || '-'}</td>
                    <td className="px-4 py-2 text-center">{b.is_active ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2 text-center">{b.position || 0}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button onClick={() => onEdit(b)} className="px-3 py-1 rounded bg-yellow-500 text-white">Edit</button>
                        <button onClick={() => onDelete(b.id)} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6" colSpan={6}>No banners yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBanners;


