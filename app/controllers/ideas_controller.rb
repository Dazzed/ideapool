class IdeasController < ApplicationController
  require 'json_web_token'
  before_action :authenticate_user, except: [:index]

  def index
    limit = 10
    totalPages = 0
    if request.cookies['__idea_access_token'].nil?
      ideas = Idea.where(public: true).limit(limit)
      totalPages = (Idea.where(public: true).count/limit.to_f).ceil
      @ideas_props = { name: "Guest", avatar_url: "/assets/user.png", ideas: ideas, totalPages: totalPages }
    else
      begin
        id = JsonWebToken.decode(request.cookies['__idea_access_token'])[0]["user_id"].to_i
        u = User.find(id)
        if u.nil? || u.jwt != request.cookies['__idea_access_token'] || u.refresh_token.nil?
          ideas = Idea.where(public: true).limit(limit)
          totalPages = (Idea.where(public: true).count/limit.to_f).ceil
          @ideas_props = { name: "Guest", avatar_url: "/assets/user.png", ideas: ideas, totalPages: totalPages }
          return 
        end
        ideas = u.ideas.limit(limit)
        totalPages = (u.ideas.count/limit.to_f).ceil

        @ideas_props = { name: u.name, avatar_url: u.avatar_url, ideas: ideas, totalPages: totalPages }
      rescue Exception => e 
        ideas = Idea.where(public: true).limit(limit)
        totalPages = (Idea.where(public: true).count/limit.to_f).ceil
        @ideas_props = { name: "Guest", avatar_url: "/assets/user.png", ideas: ideas, totalPages: totalPages }
        return
      end
    end
  end
end
