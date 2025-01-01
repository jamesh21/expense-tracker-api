const register = (req, res) => {
    res.send("Register");
};

const login = (req, res) => {
    res.send("Login");
};

module.exports = { register, login };
