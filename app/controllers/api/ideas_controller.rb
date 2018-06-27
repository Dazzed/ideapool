class Api::IdeasController < ApplicationController
  protect_from_forgery with: :null_session
  require 'json_web_token'
  def create
    begin
      if JsonWebToken.decode(request.headers['x-access-token']) 
        id = JsonWebToken.decode(request.headers['x-access-token'])[0]["user_id"].to_i
        if User.find(id).jwt == request.headers['x-access-token']
          if !User.find(id).refresh_token.nil? 
            if !params[:idea][:content].nil? && params[:idea][:content].strip != ""
              u = User.find(id)
              idea = u.ideas.build(idea_params)
              if idea.save
                render json: idea, status: 201
              else
                render json: { errors: idea.errors.full_messages }, status: :bad_request
              end
            else
              render json: { errors: "Content must exists" }, status: :bad_request
            end
          else
            render json: { errors: "Please Login" }, status: :bad_request       
          end
        else
          render json: { errors: "Use New Access Token" }, status: :bad_request
        end
      else
        render json: { errors: "session expired" }, status: :bad_request
      end
    rescue => e 
      render json: { errors: e }, status: 401
    end
  end

  def index
    order_by = "created_at"
    if !params[:order].nil?
      order_by = params[:order]
    end
    begin
      if JsonWebToken.decode(request.headers['x-access-token'])
        id = JsonWebToken.decode(request.headers['x-access-token'])[0]["user_id"].to_i
        if User.find(id).jwt == request.headers['x-access-token']
          if !User.find(id).refresh_token.nil?  
            a = Idea.select(:id,:content,:impact,:ease,:confidence,:public,:created_at).where(user_id: id).order(order_by + " desc").paginate(page: params[:page], per_page: 10) 
            render :json => a, status: 200
          else
            render json: { errors: "Please Login" }, status: :bad_request          
          end
        else
          render json: { errors: "Use New Access Token" }, status: :bad_request
        end
      else
        render json: { errors: "session expired" }, status: 401
      end
    rescue => e 
        a = Idea.select(:id,:content,:impact,:ease,:confidence,:public, :created_at).where(public: true).order(order_by + " desc").paginate(page: params[:page], per_page: 10) 
        render :json => a, status: 200
    end
  end

  def update
    begin
      if JsonWebToken.decode(request.headers['x-access-token'])
        id = JsonWebToken.decode(request.headers['x-access-token'])[0]["user_id"].to_i
        if User.find(id).jwt == request.headers['x-access-token']
          if !User.find(id).refresh_token.nil?  
            idea = Idea.find(params[:id])
            if idea.update(idea_params)
              render json: {id: idea.id, content: idea.content, impact: idea.impact, ease: idea.ease, confidence: idea.confidence, public: idea.public, created_at: (idea.created_at)}, status: 200
            else
              render json: { errors: user.errors.full_messages }, status: :bad_request
            end
          else
            render json: { errors: "Please Login" }, status: :bad_request          
          end
        else
          render json: { errors: "Use New Access Token" }, status: :bad_request
        end
      else
        render json: { errors: "session expired" }, status: :bad_request
      end
    rescue => e 
      render json: { errors: e }, status: 401
    end
  end

  def destroy
    begin
      if JsonWebToken.decode(request.headers['x-access-token'])
        id = JsonWebToken.decode(request.headers['x-access-token'])[0]["user_id"].to_i
        if User.find(id).jwt == request.headers['x-access-token']
          if !User.find(id).refresh_token.nil?  
            id = params[:id]
            Idea.find(id).destroy
            response.headers["content-length"] = 0
          else
            render json: { errors: "Please Login" }, status: :bad_request          
          end  
        else
          render json: { errors: "Use New Access Token" }, status: :bad_request
        end
      else
        render json: { errors: "session expired" }, status: 401
      end
    rescue => e 
      render json: { errors: e }, status: 401
    end
  end

  private

  def idea_params
    params.require(:idea).permit(:content, :impact, :ease, :confidence, :public, :user_id)
  end
end
