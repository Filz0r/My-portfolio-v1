const express = require("express");
const { logger } = require("../../controllers/logs");

//models
const ProjectPT = require("../../models/pt/projectSchema");
const About = require("../../models/pt/aboutSchema");
const Skill = require("../../models/skillSchema");

//middleware
const { checkAuthenticated } = require("../../controllers/AuthController");
const {
  saveProjectAndRedirect,
  saveAboutAndRedirect,
} = require("../../controllers/admin.js");

const router = express.Router();

//Handles the pt homepage
router.get("/", checkAuthenticated, async (req, res) => {
  try {
    const path = req.originalUrl;
    const skills = await Skill.find();
    const about = await About.find();
    res.status(200).render("admin/admin.ejs", {
      user: req.user,
      path: path,
      about: about.length < 1 ? new About() : about[0],
      skills: skills,
      title: "Administration | Filipe Figueiredo",
    });
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});

router.post("/", checkAuthenticated, async (req, res, next) => {
    try {
      await About.deleteMany();
      logger.info("Data purged proceeding to update");
    } catch (e) {
      logger.error(e);
    }
    req.about = new About();
    next();
  },
  saveAboutAndRedirect("pt")
);

router.get("/projects", checkAuthenticated, async (req, res) => {
  try {
    const path = req.originalUrl;
    const projectsPT = await ProjectPT.find().sort({ createdAt: "desc" });
    res.status(200).render("projects/index", {
      user: req.user,
      projects: projectsPT,
      title: "Admin Projects | Filipe Figueiredo",
      path,
    });
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});

router.get("/projects/new", checkAuthenticated, async (req, res) => {
  try {
    const path = req.originalUrl;
    res.status(200).render("projects/new", {
      user: req.user,
      project: new ProjectPT(),
      title: "New Project | Filipe Figueiredo",
      path: path,
    });
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});

router.get("/projects/:slug", checkAuthenticated, async (req, res) => {
  try {
    const projectPT = await ProjectPT.findOne({ slug: req.params.slug });
    if (projectPT == null) res.redirect("/projects");
    res.status(200).render("projects/show", {
      user: req.user,
      project: projectPT,
      title: `${projectPT.title} | Filipe Figueiredo`,
    });
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});

router.get("/projects/edit/:id", checkAuthenticated, async (req, res) => {
  try {
    const project = await ProjectPT.findById(req.params.id);
    const path = req.originalUrl;
    res.status(200).render("projects/edit", {
      user: req.user,
      project: project,
      path: path,
      title: `Edit: ${project.title} | Filipe Figueiredo`,
    });
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});

router.post("/projects/new",checkAuthenticated,
  async (req, res, next) => {
    req.project = new ProjectPT();
    next();
  },
  saveProjectAndRedirect("new", 'pt')
);

router.put("/projects/edit/:id/",checkAuthenticated,async (req, res, next) => {
    req.project = await ProjectPT.findById(req.params.id);
    res.status(302);
    next();
  },
  saveProjectAndRedirect("edit", 'pt')
);

router.delete("/projects/:id", checkAuthenticated, async (req, res) => {
  try {
    await ProjectPT.findOneAndDelete(req.params.id);
    res.status(200).redirect("/admin/pt/projects");
  } catch (e) {
    logger.error(e);
    res.status(400).redirect("/null");
  }
});

module.exports = router;
