import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setResult('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('/api/image/validate', formData);
      const { result: res, blurPercentage } = response.data;

      setResult(
        `${res} • ${
          blurPercentage === 0 ? '100% Clear Image' : `${blurPercentage}% Blur Detected`
        }`
      );
    } catch (error) {
      console.error(error);
      setResult('❌ Error validating image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">
                Agentic AI Document Checker
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                {image && (
                  <div className="mb-3 text-center">
                    <p className="fw-semibold mb-2">Preview</p>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="preview"
                      className="img-fluid rounded border"
                      style={{ maxHeight: '250px', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Processing...
                      </>
                    ) : (
                      'Validate Image'
                    )}
                  </button>
                </div>
              </form>

              {result && (
                <div className="alert alert-info mt-4 text-center">
                  <strong>Result:</strong> {result}
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-muted mt-3 small">
            Supported formats: JPG, PNG • Max clarity recommended
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
