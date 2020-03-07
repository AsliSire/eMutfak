using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
  public class Employee
  {
    public int Id { get; set; }
    public int emp_username { get; set; }
    public int emp_password { get; set; }
    public int emp_password_control { get; set; }
    public string jwt_key { get; set; }
  }
}
