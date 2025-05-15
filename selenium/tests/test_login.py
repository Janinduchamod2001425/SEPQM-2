import pytest
from pages.login_page import LoginPage

@pytest.mark.parametrize("username,password,expected_result,expected_message", [
    ("standard_user", "secret_sauce", "redirect", "/inventory.html"),
    ("locked_out_user", "secret_sauce", "error", "Epic sadface: Sorry, this user has been locked out."),
    ("", "secret_sauce", "error", "Epic sadface: Username is required"),
    ("standard_user", "", "error", "Epic sadface: Password is required"),
])
def test_login_scenarios(browser, username, password, expected_result, expected_message):
    login_page = LoginPage(browser)
    login_page.load()
    login_page.login(username, password)
    
    if expected_result == "error":
        error_text = login_page.get_error_message()
        assert expected_message in error_text, f"Expected '{expected_message}' in error text, got '{error_text}'"
    else:
        assert expected_message in browser.current_url