import Joi from "joi";
import pgPromise from "pg-promise"

const db = pgPromise()("postgres://postgres:postgres@localhost:5432/planets")
console.log(db)

const setupDb = async () => {
  await db.none(`
  DROP TABLE IF EXISTS planets;

  CREATE TABLE planets (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT
      )
  `);

  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Jupiter')`);
};
setupDb();


const getAll = async (req, res) => {
  const planets = await db.many(`SELECT * FROM planets`);
  res.status(200).json(planets);
};

const getOneById = async (req, res) => {
  const { id } = req.params;
  const planet = await db.oneOrNone(
    `SELECT * FROM planets WHERE id=$1;`,
    Number(id)
  );

  res.status(200).json(planet);
};

const planetSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
});

const createNew = async (req, res) => {
  const { name } = req.body;
  const newPlanet = { name };
  const validateNewPlanet = planetSchema.validate(newPlanet);

  if (validateNewPlanet.error) {
    return res
      .status(400)
      .json({ msg: validateNewPlanet.error.details[0].message });
  } else {
    await db.none(`INSERT INTO planets (name) VALUES ($1)`, name);

    res.status(201).json({ msg: "The planet was created" });
  }
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name]);

  res.status(200).json({ msg: "New Planet was updated" });
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));

  res.status(200).json({ msg: "New Planet was deleted" });
};

const uploadImage = async (req, res) => {
  const { id } = req.params;
  const filename = req.file?.path;
  if (filename) {
    await db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [id, filename]);
    res.status(201).json({ msg: "Planet image uploaded successfully" });
  } else {
    res.status(400).json({ msg: "Planet image failed to upload" });
  }
};
export { getAll, getOneById, createNew, updateById, deleteById, uploadImage };