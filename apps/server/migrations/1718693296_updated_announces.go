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

		collection, err := dao.FindCollectionByNameOrId("fqf4zcy3lirrx4e")
		if err != nil {
			return err
		}

		// add
		new_client := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "myigj1zj",
			"name": "client",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "f3qchac4sw99baa",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_client); err != nil {
			return err
		}
		collection.Schema.AddField(new_client)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("fqf4zcy3lirrx4e")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("myigj1zj")

		return dao.SaveCollection(collection)
	})
}