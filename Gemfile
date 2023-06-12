# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.1.2"

gem "acts_as_list"
gem "bootsnap", ">= 1.4.4", require: false
gem "figaro"
gem "jbuilder", "~> 2.7"
gem "jquery-rails"
gem "pg", "~> 1.1"
gem "puma", "~> 5.0"
gem "rails", "~> 6.1.7", ">= 6.1.7.3"
gem "redis", "~> 4.0"
gem "sass-rails", ">= 6"
gem "stimulus-rails"
gem "turbolinks", "~> 5"
gem "webpacker", "~> 5.0"

group :development, :test do
  gem "byebug", platforms: %i[mri mingw x64_mingw]
  gem "faker"
  gem "rubocop"
  gem "rubocop-faker"
  gem "rubocop-performance"
  gem "rubocop-rails"
end

group :development do
  gem "listen", "~> 3.3"
  gem "rack-mini-profiler", "~> 2.0"
  gem "spring"
  gem "web-console", ">= 4.1.0"
end

group :test do
  gem "capybara", ">= 3.26"
  gem "minitest"
  gem "selenium-webdriver", ">= 4.0.0.rc1"
  gem "webdrivers"
end

gem "tzinfo-data", platforms: %i[mingw mswin x64_mingw jruby]
