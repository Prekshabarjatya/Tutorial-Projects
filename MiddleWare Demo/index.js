const express = require('express');
const fs = require('fs');
let users = require('./MOCK_DATA.json');
const app = express();
const PORT = 8001;

// Built-in Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Custom Logger Middleware

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Validation Middleware for POST

function validateUserData(req, res, next) {
  const { first_name, last_name, email, gender, address_line_1 } = req.body;
  if (!first_name || !last_name || !email || !gender || !address_line_1) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  next();
}

// Routes

app.get("/users", (req, res) => {
  const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>`;
  res.send(html);
});

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.route('/api/users/:id')
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    // Merge updates
    users[userIndex] = { ...users[userIndex], ...req.body };
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), err => {
      if (err) {
        console.error("Error writing file", err);
        return res.status(500).json({ error: "Failed to update user" });
      }
      res.json(users[userIndex]);
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const newUsers = users.filter(user => user.id !== id);
    if (newUsers.length === users.length) {
      return res.status(404).json({ error: "User not found" });
    }
    users = newUsers;
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), err => {
      if (err) {
        console.error("Error writing file", err);
        return res.status(500).json({ error: "Failed to delete user" });
      }
      res.json({ status: "User deleted successfully" });
    });
  });

app.post("/api/users", validateUserData, (req, res) => {
  const { first_name, last_name, email, gender, address_line_1 } = req.body;
  
  const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
  const newId = maxId + 1;
  const newUser = { id: newId, first_name, last_name, email, gender, address_line_1 };

  users.push(newUser);

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error("Error writing file", err);
      return res.status(500).json({ error: "Failed to save user" });
    }
    return res.status(201).json(newUser);
  });
});

// Error-Handling Middleware 

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: "Something broke!" });
});

//Server Start 

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
