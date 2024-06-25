package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("f3qchac4sw99baa")
		if err != nil {
			return err
		}

		// update
		edit_first_name := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "qgzwmkfn",
			"name": "first_name",
			"type": "text",
			"required": false,
			"presentable": true,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), edit_first_name); err != nil {
			return err
		}
		collection.Schema.AddField(edit_first_name)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("f3qchac4sw99baa")
		if err != nil {
			return err
		}

		// update
		edit_first_name := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "qgzwmkfn",
			"name": "first_name",
			"type": "text",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), edit_first_name); err != nil {
			return err
		}
		collection.Schema.AddField(edit_first_name)

		return dao.SaveCollection(collection)
	})
}