
import { useState } from "react";
import {
  House,
  Info,
  ImagePlus,
  Sparkles,
  Upload,
  X,
  Copy,
  Download,
  ScanEye,
  Leaf,
} from "lucide-react";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Home");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Please upload a JPG, JPEG, or PNG image.");
      event.target.value = "";
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setCaption("");
  }

  function removeImage() {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview("");
    setCaption("");
  }

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption);
      alert("Caption copied!");
    } catch {
      alert("Unable to copy. Please select and copy the caption.");
    }
  }

  function downloadCaption() {
    const blob = new Blob([caption], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "pixelwords-caption.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  async function generateCaption() {
    if (!image) return;

    setLoading(true);
    setCaption("");

    try {
      const formData = new FormData();
      formData.append("file", image);

      const response = await fetch(
        "http://127.0.0.1:8000/caption",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Caption generation failed.");
      }

      setCaption(data.caption);
    } catch (error) {
      alert(
        error.message ||
        "Cannot connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <ScanEye size={23} />
          </div>
          <span>pixel<span className="brand-accent">words</span></span>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <nav className="side-nav">
          <button
            className={`nav-item ${activePage === "Home" ? "active" : ""}`}
            onClick={() => setActivePage("Home")}
          >
            <House size={18} />
            <span>Home</span>
          </button>

          <button
            className={`nav-item ${activePage === "About" ? "active" : ""}`}
            onClick={() => setActivePage("About")}
          >
            <Info size={18} />
            <span>About</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <Leaf size={19} />
            <p>Turning visual moments into words.</p>
          </div>
          <span className="version-label">IMAGE INTELLIGENCE · 01</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <span className="breadcrumb">
            Workspace <span>/</span> {activePage}
          </span>
          <div className="status-pill">
            <span className="status-dot" />
            AI STUDIO
          </div>
        </header>

        {activePage === "Home" ? (
          <div className="page-content">
            <section className="hero">
              <div className="eyebrow">
                <Sparkles size={14} />
                YOUR IMAGE, UNDERSTOOD
              </div>

              <h1>
                Every image
                <br />
                tells a <em>story.</em>
              </h1>

              <p className="hero-description">
                Turn your photographs into meaningful words.
                Upload an image and let AI describe the moment
                captured within it.
              </p>
            </section>

            <section className="upload-section">
              <div className="section-heading">
                <div>
                  <span className="step-number">01</span>
                  <h2>Bring your image</h2>
                </div>
                <span className="file-hint">JPG · JPEG · PNG</span>
              </div>

              {!preview ? (
                <label className="upload-zone">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={handleImageUpload}
                    hidden
                  />

                  <div className="upload-icon">
                    <ImagePlus size={27} strokeWidth={1.5} />
                  </div>

                  <h3>Drop a moment in here</h3>
                  <p>
                    Choose a photograph from your device to get started.
                  </p>

                  <span className="browse-button">
                    <Upload size={16} />
                    Browse images
                  </span>

                  <span className="upload-footnote">
                    Your image is processed for caption generation.
                  </span>
                </label>
              ) : (
                <div className="selected-image">
                  <div className="selected-image-header">
                    <span className="selected-label">
                      <span className="status-dot" />
                      IMAGE SELECTED
                    </span>
                    <button
                      className="icon-button"
                      onClick={removeImage}
                      aria-label="Remove image"
                      title="Remove image"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <img
                    className="image-preview"
                    src={preview}
                    alt="Selected image preview"
                  />

                  <div className="file-information">
                    <div className="file-symbol">
                      <ImagePlus size={19} />
                    </div>
                    <div className="file-details">
                      <strong>{image?.name}</strong>
                      <span>
                        {image
                          ? `${(image.size / 1024).toFixed(0)} KB`
                          : ""}
                      </span>
                    </div>
                    <button
                      className="change-button"
                      onClick={() =>
                        document.getElementById("replace-image").click()
                      }
                    >
                      Change
                    </button>
                    <input
                      id="replace-image"
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      hidden
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              )}
            </section>

            <section className="result-section">
              <div className="section-heading">
                <div>
                  <span className="step-number">02</span>
                  <h2>Discover the story</h2>
                </div>
                <span className="ai-label">
                  <Sparkles size={14} /> BLIP AI
                </span>
              </div>

              <div className="caption-panel">
                <div className="caption-panel-top">
                  <span>GENERATED DESCRIPTION</span>
                  <Sparkles size={17} />
                </div>

                {loading ? (
                  <div className="empty-caption">
                    <div className="loader" />
                    <p>Looking closely at your image...</p>
                  </div>
                ) : caption ? (
                  <div className="caption-output">
                    <p>{caption}</p>
                    <div className="caption-actions">
                      <button onClick={copyCaption}>
                        <Copy size={15} /> Copy
                      </button>
                      <button onClick={downloadCaption}>
                        <Download size={15} /> Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="empty-caption">
                    <div className="empty-sparkle">
                      <Sparkles size={22} />
                    </div>
                    <p>Your image's story will appear here.</p>
                    <span>
                      Upload an image, then generate its caption.
                    </span>
                  </div>
                )}

                <button
                  className="generate-button"
                  onClick={generateCaption}
                  disabled={!image || loading}
                >
                  <Sparkles size={17} />
                  {loading ? "Generating..." : "Generate caption"}
                </button>
              </div>
            </section>

            <footer className="page-footer">
              <span>Made with curiosity.</span>
              <span>POWERED BY PYTHON · BLIP</span>
            </footer>
          </div>
        ) : (
          <div className="page-content about-page">
            <div className="eyebrow">
              <Leaf size={14} /> ABOUT THE PROJECT
            </div>
            <h1>
              Helping images
              <br />
              find their <em>words.</em>
            </h1>
            <p className="hero-description">
              PixelWords is an AI-powered image captioning application
              that transforms photographs into natural-language
              descriptions.
            </p>

            <div className="about-card">
              <h2>How it works</h2>
              <p>
                Upload an image, and the BLIP vision-language model
                analyzes its visual content to generate a caption.
                The application uses React for its interface and
                FastAPI to communicate with the AI model.
              </p>
            </div>

            <div className="about-card">
              <h2>Built with</h2>
              <div className="tech-tags">
                <span>React</span>
                <span>Python</span>
                <span>FastAPI</span>
                <span>BLIP</span>
                <span>PyTorch</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
