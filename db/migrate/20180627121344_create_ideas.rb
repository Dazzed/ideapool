class CreateIdeas < ActiveRecord::Migration[5.1]
  def change
    create_table :ideas do |t|
      t.text        :content
      t.integer     :impact
      t.integer     :ease
      t.integer     :confidence
      t.boolean     :public, default: false
      t.references  :user
      t.timestamps
    end
  end
end
