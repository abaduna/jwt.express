import passport from "passport";
import local from "passport-local";

import userModel from "../models/Users.model";
import { createHash, isValidPassword } from "../utils.js";

const localStrategy = local.Strategy;

const initializadPassword = () => {
  passport.use(
    "register",
    new localStrategy({
      passReqToCallback: true,
      usernameField: "email",
    })
  );
  async (req, username, password, done) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (user) {
        return done(null, false);
      }
      let result = await userModel.create(user);

      const userio = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
      };
      let resultado = await userModel.create(user);
      return done(null, resultado);
    } catch (error) {
      return done("user not fount " + error);
    }
  };
  passport.use(
    "login",
    new localStrategy({
      passReqToCallback: true,
      usernameField: "email",
    })
  );
  async (req, email, password, done) => {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return done(null, false);
      }

      if (!isValidPassword(user, password)) if (!user) return done(null, false);

      let resultado = await userModel.create(user);
      return done(null, resultado);
    } catch (error) {
      return  done(null, false);
    }
  };
  passport.serializeUser((user,done)=>{
    done(null,user.id)
  })
  passport.deserializeUser(async(id,done)=>{
    let user = await userModel.findById(id)
    done(null,user)
  })
};

export default initializadPassword