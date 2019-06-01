require 'test_helper'

class Api::AccessTokensControllerTest < ActionDispatch::IntegrationTest
  test "User Login" do
    user = {
      user: {
        name: "User 1",
        email: "user1@gmail.com",
        password: "abcd1234"
      }
    }

    post "/api/users", params: user
    userObj = JSON.parse(response.body)
    assert_equal 200, response.status

    user_login = {
      email: "user1@gmail.com",
      password: "abcd1234"
    }

    post "/api/access_tokens", params: user_login
    userLoginObj = JSON.parse(response.body)
    assert_equal 201, response.status
  end
end
