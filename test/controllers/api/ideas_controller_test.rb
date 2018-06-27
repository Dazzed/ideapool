require 'test_helper'

class Api::IdeasControllerTest < ActionDispatch::IntegrationTest
  test "Create Idea" do
    idea = {
      idea: {
        content: "My Idea",
        impact: 9,
        ease: 7,
        confidence: 7,
        public: true
      }
    }

    user = {
      user: {
        email: "user1@gmail.com",
        name: "User",
        password: "abcd1234"
      }
    }
    post "/api/users", params: user
    userObj = JSON.parse(response.body)
    assert_equal 200, response.status

    post "/api/ideas", params: idea, headers: {
      "x-access-token": userObj["jwt"]
    }

    assert_equal 201, response.status
    
    idea_created = Idea.find_by(:content => idea[:idea][:content])
    assert idea_created.public?
  end

  test "View Ideas" do
    idea = {
      idea: {
        content: "My Idea",
        impact: 9,
        ease: 7,
        confidence: 7,
        public: true
      }
    }

    user = {
      user: {
        email: "user1@gmail.com",
        name: "User",
        password: "abcd1234"
      }
    }
    post "/api/users", params: user
    userObj = JSON.parse(response.body)
    assert_equal 200, response.status

    post "/api/ideas", params: idea, headers: {
      "x-access-token": userObj["jwt"]
    }

    assert_equal 201, response.status
    
    idea_created = Idea.find_by(:content => idea[:idea][:content])
    assert idea_created.public?


    get "/api/ideas", headers: {
      "x-access-token": userObj["jwt"]
    }

    assert_equal 200, response.status
    ideasObj = JSON.parse(response.body)
    assert_equal 1, ideasObj.length
  end

  test "Edit Idea" do
    idea = {
      idea: {
        content: "My Idea",
        impact: 9,
        ease: 7,
        confidence: 7,
        public: true
      }
    }

    user = {
      user: {
        email: "user1@gmail.com",
        name: "User",
        password: "abcd1234"
      }
    }
    post "/api/users", params: user
    userObj = JSON.parse(response.body)
    assert_equal 200, response.status

    post "/api/ideas", params: idea, headers: {
      "x-access-token": userObj["jwt"]
    }

    assert_equal 201, response.status
    
    idea_created = Idea.find_by(:content => idea[:idea][:content])
    assert idea_created.public?

    idea = {
      idea: {
        content: "My Idea Updated",
      }
    }

    patch "/api/ideas/#{idea_created.id}", params: idea, headers: {
      "x-access-token": userObj["jwt"]
    }

    assert_equal 200, response.status
    ideasObj = JSON.parse(response.body)

    assert_equal "My Idea Updated", ideasObj["content"]
  end

  test "Delete Idea" do
    idea = {
      idea: {
        content: "My Idea",
        impact: 9,
        ease: 7,
        confidence: 7,
        public: true
      }
    }

    user = {
      user: {
        email: "user1@gmail.com",
        name: "User",
        password: "abcd1234"
      }
    }
    post "/api/users", params: user
    userObj = JSON.parse(response.body)
    assert_equal 200, response.status

    post "/api/ideas", params: idea, headers: {
      "x-access-token": userObj["jwt"]
    }

    assert_equal 201, response.status
    
    idea_created = Idea.find_by(:content => idea[:idea][:content])

    delete "/api/ideas/#{idea_created.id}", headers: {
      "x-access-token": userObj["jwt"]
    }

    assert_equal 204, response.status
  end

end
