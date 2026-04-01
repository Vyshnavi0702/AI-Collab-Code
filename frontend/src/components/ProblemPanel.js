function ProblemPanel({ problem }) {
  if (!problem) return <div>Select a problem to begin.</div>;

  return (
    <div style={{ height: "100%", color: "#c9d1d9" }}>
      <div style={{display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #30363d", paddingBottom: "15px", marginBottom: "15px"}}>
         <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "600", color: "#e6edf3" }}>{problem.title}</h2>
         <span style={{padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", background: problem.difficulty === 'Easy' ? 'rgba(46,160,67,0.15)' : problem.difficulty === 'Medium' ? 'rgba(210,153,34,0.15)' : 'rgba(248,81,73,0.15)', color: problem.difficulty === 'Easy' ? '#3fb950' : problem.difficulty === 'Medium' ? '#d29922' : '#f85149', border: `1px solid ${problem.difficulty === 'Easy' ? 'rgba(46,160,67,0.4)' : problem.difficulty === 'Medium' ? 'rgba(210,153,34,0.4)' : 'rgba(248,81,73,0.4)'}`}}>
            {problem.difficulty}
         </span>
      </div>
      
      <div style={{ fontSize: "15px", lineHeight: "1.6", color: "#c9d1d9", whiteSpace: "pre-wrap" }}>
        {problem.description}
      </div>

      <h4 style={{marginTop: "30px", marginBottom: "15px", color: "#e6edf3"}}>Examples & Test Cases</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {problem.testCases && problem.testCases.map((tc, idx) => (
           <div key={idx} style={{ background: "#0d1117", padding: "12px 16px", borderRadius: "8px", border: "1px solid #30363d" }}>
              <div style={{fontFamily: "monospace", fontSize: "14px", lineHeight: "1.5"}}>
                 <strong style={{color:"#8b949e"}}>Input:</strong> <span style={{color: "#e6edf3"}}>{tc.input}</span><br/>
                 <strong style={{color:"#8b949e"}}>Expected:</strong> <span style={{color: "#e6edf3"}}>{tc.expectedOutput}</span>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}

export default ProblemPanel;