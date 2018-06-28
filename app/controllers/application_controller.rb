class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def authenticate_user
    begin
      if JsonWebToken.decode(request.headers['x-access-token']) 
        id = JsonWebToken.decode(request.headers['x-access-token'])[0]["user_id"].to_i
        @user = User.find(id)
        if @user.nil?
          return render json: { errors: e }, status: 401
        end
        if @user.jwt != request.headers['x-access-token']
          return render json: { errors: "Use New Access Token" }, status: :bad_request
        end
        if @user.refresh_token.nil?
          return render json: { errors: "Please Login" }, status: :bad_request
        end
      else
        return render json: { errors: e }, status: 401
      end
    rescue => e 
      render json: { errors: e }, status: 401
    end
  end

end
