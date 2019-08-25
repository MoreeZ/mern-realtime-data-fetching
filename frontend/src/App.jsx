import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Loader from "react-loader";

const App = () => {
  const [users, setUsers] = useState([]);
  const [value, setValue] = useState("");
  const [loaded, setLoaded] = useState(true);
  const [error, setError] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    setLoaded(false);
    axios
      .post("http://localhost:5000/api/adduser", { name: value })
      .then(() => {
        axios
          .post("http://localhost:5000/api/getdata")
          .then(res => {
            console.log("success", res.data);
            setUsers(res.data);
            setValue("");
            setLoaded(true);
          })
          .catch(err => {
            setError(err.message);
            setLoaded(true);
          });
      })
      .catch(err => {
        setError(err.message);
        setLoaded(true);
      });
  };

  useEffect(() => {
    setLoaded(false);
    axios
      .post("http://localhost:5000/api/getdata")
      .then(res => {
        console.log("success", res.data);
        setUsers(res.data);
        setLoaded(true);
      })
      .catch(err => {
        console.log("error", err);
        setError(err.message);
        setLoaded(true);
      });
  }, []);

  return (
    <div className="App">
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <label>Add User</label>
        <input
          type="text"
          onChange={e => setValue(e.target.value)}
          value={value}
        />
        <button type="submit">Submit</button>
      </form>
      <br />
      <Loader loaded={loaded}></Loader>
      {loaded ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>{user.name}</li>
          ))}
        </ul>
      ) : (
        error && error.length > 0 && error
      )}
    </div>
  );
};

export default App;
