using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
  public class Product
  {
    public int Id { get; set; }
    public string rec_tck_no { get; set; }
    public string rec_name_surname { get; set; }
    public string rec_password { get; set; }
    public string rec_password_control { get; set; }
    public decimal prd_price { get; set; }
    public int prd_currency_unit { get; set; }
    public decimal prd_calculated_value { get; set; }
    public string cur_name { get; set; }
  }
}
