const express = require("express");
const { logger } = require("../controllers/logs");
const { setLanguage } = require("../controllers/language");

const Skill = require("../models/skillSchema");
const About = require("../models/eng/aboutSchema");
const Project = require("../models/eng/projectSchema");

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(302).redirect("/");
});
router.get("/home", async (req, res, next) => {
  const about = await About.find();
  const allSkills = await Skill.find();
  const skills = about[0].skillBag.filter((name) => name);
  const skillsSet = new Set(skills);

  const lang = await setLanguage('eng')

  const userWebDevSkills = allSkills
    .filter((e) => e.category == "Web Development")
    .map((n) => ({ name: n.name, path: n.path }))
    .filter((n) => skillsSet.has(n.name));
  const userDevOpsSkills = allSkills
    .filter((e) => e.category == "DevOps")
    .map((n) => ({ name: n.name, path: n.path }))
    .filter((n) => skillsSet.has(n.name));
  
  res.status(200).render("home.ejs", {
    title: "Homepage | Filipe Figueiredo",
    user: req.user,
    about: about[0],
    webDev: userWebDevSkills,
    devOps: userDevOpsSkills,
    language: lang,
  });

});

router.get("/projects", async (req, res) => {
  try {
    const path = req.originalUrl;
    const lang = await setLanguage('eng')
    const projects = await Project.find({ published: true }).sort({
      createdAt: "desc",
    });
    res.status(200).render("projects.ejs", {
      user: req.user,
      projects: projects,
      path: path,
      title: "Portfolio | Filipe Figueiredo",
      language: lang
    });
  } catch (e) {
    res.status(400).redirect("null");
    return;
  }
});

router.get("/projects/:slug", async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    const lang = await setLanguage('eng')
    res.status(200).render("projects/show", {
      user: req.user,
      project: project,
      title: `${project.title} | Filipe Figueiredo`,
      language: lang
    });
  } catch (e) {
    res.status(400).redirect("/null");
    return;
  }
});

module.exports = router;
