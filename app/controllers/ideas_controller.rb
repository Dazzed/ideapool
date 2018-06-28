class IdeasController < ApplicationController
  require 'json_web_token'
  before_action :authenticate_user, except: [:index]

  def index
    if request.cookies['__idea_access_token'].nil?
      ideas = Idea.where(public: true)
      @ideas_props = { name: "Guest", avatar_url: "/assets/user.png", ideas: ideas }
    else
      begin
        id = JsonWebToken.decode(request.cookies['__idea_access_token'])[0]["user_id"].to_i
        u = User.find(id)
        if u.nil? || u.jwt != request.cookies['__idea_access_token'] || u.refresh_token.nil?
          ideas = Idea.where(public: true)
          @ideas_props = { name: "Guest", avatar_url: "/assets/user.png", ideas: ideas }
          return 
        end
        ideas = u.ideas
        @ideas_props = { name: u.name, avatar_url: u.avatar_url, ideas: ideas }
      rescue Exception => e 
        ideas = Idea.where(public: true)
        @ideas_props = { name: "Guest", avatar_url: "/assets/user.png", ideas: ideas }
        return
      end
    end
  end
end
