const SubjectSelector = ({ subjects, selectedSubject, onSelect }) => {
  return (
    <div>
      <p style={{ marginBottom: "0.75rem", fontWeight: 600, color: "var(--foreground)" }}>
        Choose Subject
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {subjects.map((subject) => (
          <button
            key={subject}
            type="button"
            className={`btn ${selectedSubject === subject ? "btn-gradient" : "btn-outline"}`}
            onClick={() => onSelect(subject)}
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;
