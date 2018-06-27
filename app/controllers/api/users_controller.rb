class Api::UsersController < ApplicationController
  protect_from_forgery with: :null_session
  require 'json_web_token'

  def create
      user = User.new(user_params)
      user.password = params[:user][:password]
      user.password_confirmation = params[:user][:password]
      user.avatar_url = Gravatar.src(params[:user][:email], 128)
      if user.save
        auth_token = JsonWebToken.encode({user_id: user.id})
        user.refresh_token = SecureRandom.hex(10)
        user.jwt = auth_token
        user.save!
        render json: {jwt: auth_token,refresh_token: user.refresh_token}, status: :ok
      else
        render json: { errors: user.errors.full_messages }, status: :bad_request
      end
  end

  private
  def user_params
    params.require(:user).permit(:email, :password, :name)
  end

end
