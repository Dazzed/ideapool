class Idea < ApplicationRecord
    belongs_to :user
    validates_inclusion_of :ease, :in => 1..10
    validates_inclusion_of :impact, :in => 1..10
    validates_inclusion_of :confidence, :in => 1..10
    validates :content, :presence => true
end
