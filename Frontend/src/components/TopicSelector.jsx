import React from 'react';

const TOPICS = {
  Physics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Modern Physics", "Waves"],
  Chemistry: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Atomic Structure", "Chemical Bonding", "Equilibrium"],
  Biology: ["Cell Biology", "Genetics", "Evolution", "Human Physiology", "Plant Physiology", "Ecology"],
  Maths: ["Algebra", "Calculus", "Trigonometry", "Geometry", "Probability & Statistics", "Number Theory"]
};

const TopicSelector = ({ subject, selectedTopics, onToggleTopic }) => {
  if (!subject || !TOPICS[subject]) return null;

  const topics = TOPICS[subject];

  return (
    <div style={{ marginTop: "1rem" }}>
      <p style={{ marginBottom: "0.75rem", fontWeight: 600, color: "var(--foreground)" }}>
        Select Topics (Optional)
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {topics.map((topic) => {
          const isSelected = selectedTopics.includes(topic);
          return (
            <button
              key={topic}
              type="button"
              className={`btn btn-sm ${isSelected ? "btn-gradient" : "btn-outline"}`}
              onClick={() => onToggleTopic(topic)}
              style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
            >
              {topic}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TopicSelector;
