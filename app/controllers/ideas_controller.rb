class IdeasController < ApplicationController
    require 'json_web_token'

    def index
        if request.cookies['__idea_access_token'].nil?
            ideas = ideas.where(public: true)
            @ideas_props = { name: "Guest", avatar_url: "/assets/user.png", ideas: ideas }
        else
            begin
                id = JsonWebToken.decode(request.cookies['__idea_access_token'])[0]["user_id"].to_i
            rescue Exception => e 
                return redirect_to '/signin'
            end
            u = User.find(id)
            if u.nil? || u.jwt != request.cookies['__idea_access_token'] || u.refresh_token.nil?
                return redirect_to '/signin'
            end
            ideas = u.ideas

            @ideas_props = { name: u.name, avatar_url: u.avatar_url, ideas: ideas }
        end
    end
end
