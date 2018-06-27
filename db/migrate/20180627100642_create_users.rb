class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string  :email,              null: false
      t.string  :password_digest,    null: false
      t.string  :name
      t.text    :avatar_url
      t.text    :jwt
      t.text    :refresh_token
      t.timestamps
    end
  end
end
