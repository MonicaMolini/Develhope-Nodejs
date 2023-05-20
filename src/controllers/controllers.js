import Joi from "joi";

let planets = [
    {
      id: 1,
      name: "Earth",
    },
    { id: 2, 
      name: "Mars" },
    {
      id: 3,
      name: "Jupiter",
    },
    {
      id: 4,
      name: "Venus",
    },
  ];

const getAll = (req, res) => {
  res.status(200).json(planets);
};

const getOneById = (req, res) => {
  const { id } = req.params;
  const planet = planets.find((p) => p.id === Number(id));

  res.status(200).json(planet);
};

const planetSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
});

const createNew = (req, res) => {
  const { id, name } = req.body;
  const newPlanet = { id, name };
  const validateNewPlanet = planetSchema.validate(newPlanet);

  if (validateNewPlanet.error) {
    return res
      .status(400)
      .json({ msg: validateNewPlanet.error.details[0].message });
  } else {
    planets = [...planets, newPlanet];

    res.status(201).json({ msg: "The planet was created" });
  }
};

const updateById = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  planets = planets.map((p) => (p.id === Number(id) ? { ...p, name } : p));

  res.status(200).json({ msg: "Planet was updated" });
};

const deleteById = (req, res) => {
  const { id } = req.params;
  planets = planets.filter((p) => p.id !== Number(id));

  res.status(200).json({ msg: "Planet was deleted" });
};

export { getAll, getOneById, createNew, updateById, deleteById };