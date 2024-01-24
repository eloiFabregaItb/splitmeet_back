import db from "./db.js";

export async function db_updateEventFields(event, fields) {
  const allFields = {
    evt_id: event.id,
    usr_id_creator: event.cretorId,
    evt_name: event.name,
    evt_url: event.url,
    evt_image_url: event.imgUrl,
    evt_creation_timestamp: event.creation,
    evt_modification_timestamp: event.modification,
  };

  const syntax = `UPDATE Events SET 
    ${fields.map((x) => (allFields[x] ? x + " = ? " : "")).join(",")}
    WHERE evt_id = ?`;

  const values = fields.flatMap((x) => (allFields[x] ? allFields[x] : []));
  values.push(event.id);

  try {
    await db.query(syntax, values);
  } catch (err) {
    console.log(err);
  }
}
