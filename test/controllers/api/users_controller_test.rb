require 'test_helper'

class Api::UsersControllerTest < ActionDispatch::IntegrationTest
  test "User Created" do
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
  end
end
