require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const User = require("./models/userSchema");

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster.rhhrs5n.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log("Conectado com sucesso"))
  .catch((err) => console.log(err));

//Routes
app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  return res.json(users);
});

app.post("/users", async (req, res) => {
  const { name, email, age, phoneNumber, job } = req.body;
  const user = new User({ name, email, age, phoneNumber, job });

  //validations
  if (!name) {
    return res.status(422).json({ msg: "Nome é obrigatorio" });
  }

  if (!email) {
    return res.status(422).json({ msg: "Email é obrigatorio" });
  }

  if (!age) {
    return res.status(422).json({ msg: "Idade é obrigatorio" });
  }
  if (!phoneNumber) {
    return res.status(422).json({ msg: "Telefone é obrigatorio" });
  }
  if (!job) {
    return res.status(422).json({ msg: "Profissão é obrigatorio" });
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res
      .status(422)
      .json({ msg: "Erro ao cadastrar, tente novamente mais tarde!" });
  }

  try {
    await user.save();
    return res.json({ msg: "User created successfully", user: user });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: "Erro Interno do servidor, tente novamente mais tarde" });
  }
});

app.put("/users/:id", async (req, res) => {
    const { name, email, age, phoneNumber, job } = req.body;
    const  {id}  = req.params;
    
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    } else {
        user.name = name;
        user.email = email;
        user.age = age;
        user.phoneNumber = phoneNumber;
        user.job = job;

        await user.save();

        return res.json({ msg: "User updated successfully", user: user });
    }
})

app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    } else {
        await user.remove();

        return res.json({ msg: "User deleted successfully" });
    }
})

app.listen(3000);
