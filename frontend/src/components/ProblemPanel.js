function ProblemPanel() {

  const problem = {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    example:
      "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]"
  };

  return (
    <div style={{
      border:"1px solid gray",
      padding:"10px",
      height:"500px",
      overflowY:"scroll"
    }}>

      <h3>{problem.title}</h3>

      <p>{problem.description}</p>

      <h4>Example</h4>

      <pre>{problem.example}</pre>

    </div>
  );

}

export default ProblemPanel;