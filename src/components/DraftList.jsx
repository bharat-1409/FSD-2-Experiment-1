function DraftList({ drafts, onDelete, onEdit }) {
  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Saved Drafts</h2>

      {drafts.length === 0 ? (
        <p>No Drafts Available</p>
      ) : (
        drafts.map((draft, index) => (
          <div className="draft-card" key={index}>
            <p>
              <strong>Platform:</strong> {draft.platform}
            </p>

            <p>{draft.post}</p>

            <div className="buttons">
              <button onClick={() => onEdit(index)}>
                ✏ Edit
              </button>

              <button
                style={{ background: "#dc2626" }}
                onClick={() => onDelete(index)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DraftList;