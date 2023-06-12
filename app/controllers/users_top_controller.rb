# frozen_string_literal: true

class UsersTopController < ApplicationController
  def index
    @tasks = Task.all.order(:position)
  end
end
