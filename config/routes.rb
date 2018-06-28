Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'ideas#index'
  namespace :api do
    resources :ideas
    resources :users, only: [:create]
    post 'access_tokens/refresh', to: 'access_tokens#refresh'
    post 'access_tokens', to: 'access_tokens#signin'
    delete 'access_tokens', to: 'access_tokens#delete'
  end
  get 'signup', to: 'users#signup'
  get 'signin', to: 'users#signin'

  get 'ideas', to: 'ideas#index'
end
