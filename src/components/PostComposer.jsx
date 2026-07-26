import { useState, useEffect } from "react";
import DraftList from "./DraftList";
import validationStrategies from "../utils/validation";
import { mockPublish } from "../utils/mockApi";
import "../App.css";

function PostComposer() {
  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [retryVisible, setRetryVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  const limits = {
    Twitter: 280,
    LinkedIn: 3000,
    Instagram: 2200,
  };

  const maxLimit = limits[platform];
  const isValid = validationStrategies[platform](post);

  useEffect(() => {
    const savedDrafts =
      JSON.parse(localStorage.getItem("drafts")) || [];

    setDrafts(savedDrafts);
  }, []);

  const saveDraft = () => {
    if (post.trim() === "") {
      alert("Post cannot be empty!");
      return;
    }

    if (!isValid) {
      alert("Character limit exceeded!");
      return;
    }

    const updatedDrafts = [...drafts];

    if (editIndex !== null) {
      updatedDrafts[editIndex] = {
        platform,
        post,
      };

      setEditIndex(null);
    } else {
      updatedDrafts.push({
        platform,
        post,
      });
    }

    setDrafts(updatedDrafts);

    localStorage.setItem(
      "drafts",
      JSON.stringify(updatedDrafts)
    );

    setPost("");
  };

  const deleteDraft = (index) => {
    const updatedDrafts = drafts.filter(
      (_, i) => i !== index
    );

    setDrafts(updatedDrafts);

    localStorage.setItem(
      "drafts",
      JSON.stringify(updatedDrafts)
    );
  };

  const editDraft = (index) => {
    setPlatform(drafts[index].platform);
    setPost(drafts[index].post);
    setEditIndex(index);
  };

  const publishPost = async () => {
    if (post.trim() === "") {
      alert("Write something first.");
      return;
    }

    setLoading(true);
    setRetryVisible(false);

    try {
      const response = await mockPublish({
        platform,
        post,
      });

      setSuccess(true);
      setToast(response.message);

      setTimeout(() => {
        setToast("");
      }, 3000);

    } catch (error) {

      setSuccess(false);
      setToast(error.message);

      setRetryVisible(true);

      setTimeout(() => {
        setToast("");
      }, 3000);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="container">

      <h1>Social Media Post Composer</h1>

      <label>Select Platform</label>

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      >
        <option>Twitter</option>
        <option>LinkedIn</option>
        <option>Instagram</option>
      </select>

      <textarea
        rows="8"
        placeholder="Write your amazing post..."
        value={post}
        onChange={(e) => setPost(e.target.value)}
      />

      <p className="counter">
        Characters: {post.length} / {maxLimit}
      </p>

      {!isValid && (
        <p className="error">
          Character limit exceeded!
        </p>
      )}

      <div className="buttons">
        <button onClick={saveDraft}>
          {editIndex !== null
            ? "Update Draft"
            : "Save Draft"}
        </button>

        <button
          onClick={publishPost}
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish"}
        </button>

        {retryVisible && (
          <button
            style={{ background: "#ea580c" }}
            onClick={publishPost}
          >
            Retry
          </button>
        )}
      </div>

      {toast && (
        <p
          className={
            success
              ? "toast-success"
              : "toast-error"
          }
        >
          {toast}
        </p>
      )}

      <DraftList
        drafts={drafts}
        onDelete={deleteDraft}
        onEdit={editDraft}
      />

    </div>
  );
}

export default PostComposer;