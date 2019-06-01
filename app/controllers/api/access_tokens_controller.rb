class Api::AccessTokensController < ApplicationController
  protect_from_forgery with: :null_session
  def refresh
    refresh_token= params["refresh_token"]
    user = User.find_by(refresh_token: refresh_token)
    if !user.nil?
      auth_token = JsonWebToken.encode({user_id: user.id})
      user.jwt = auth_token
      user.save!
      render json: {jwt: auth_token,refresh_token: user.refresh_token}, status: 200
    else
      render json: {success: 'Refresh Token Not Valid. Please Login'}, status: 400
    end
  end

  def signin
    user = User.find_by(email: params[:email].to_s.downcase)
    if user && user.authenticate(params[:password])
      user.refresh_token = SecureRandom.hex(10)
      auth_token = JsonWebToken.encode({user_id: user.id})
      user.jwt = auth_token
      if user.save
        render json: {jwt: auth_token,refresh_token: user.refresh_token}, status: 201
      else
        render json: {error: 'Invalid username / password'}, status: :unauthorized
      end
    else
      render json: {message: 'Invalid username / password'}, status: :unauthorized
    end
  end
end
