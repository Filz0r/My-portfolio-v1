const express = require("express");
const { logger } = require("../controllers/logs");
const { setLanguage } = require("../controllers/language");

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(302).redirect("/pt/home");
});

const Project = require("../models/pt/projectSchema");
const About = require("../models/pt/aboutSchema");
const Skill = require("../models/skillSchema");

router.get("/home", async (req, res) => {
  try {
    const about = await About.find();
    const allSkills = await Skill.find();
    const skills = about[0].skillBag.filter((name) => name);
    const skillsSet = new Set(skills);

    const lang = await setLanguage("pt");

    const userWebDevSkills = allSkills
      .filter((elem) => elem.category == "Web Development")
      .map((n) => ({ name: n.name, path: n.path }))
      .filter((n) => skillsSet.has(n.name));
    const userDevOpsSkills = allSkills
      .filter((elem) => elem.category == "DevOps")
      .map((n) => ({ name: n.name, path: n.path }))
      .filter((n) => skillsSet.has(n.name));
    res.status(200).render("home.ejs", {
      title: "Homepage | FilipeDev",
      user: req.user,
      about: about[0],
      webDev: userWebDevSkills,
      devOps: userDevOpsSkills,
      language: lang,
    });
  } catch (e) {
    res.status(400).redirect("null");
    logger.error(e);
  }
});

router.get("/projects", async (req, res) => {
  try {
    const path = req.originalUrl;
    const projects = await Project.find({ published: true }).sort({
      createdAt: "desc",
    });
    const lang = await setLanguage("pt");
    res.status(200).render("projects.ejs", {
      user: req.user,
      projects: projects,
      path: path,
      title: "Portfolio | Filipe Figueiredo",
      language: lang,
    });
  } catch (e) {
    res.status(400).redirect("null");
    return;
  }
});

router.get("/projects/:slug", async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    const lang = await setLanguage("pt");
    res.status(200).render("projects/show", {
      user: req.user,
      project: project,
      title: `${project.title} | Filipe Figueiredo`,
      language: lang,
    });
  } catch (e) {
    res.status(400).redirect("/null");
    return;
  }
});

module.exports = router;
