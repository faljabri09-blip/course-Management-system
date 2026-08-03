using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Course_system.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }                      // system generated

        [Required]
        [MaxLength(50)]
        public string Username { get; set; }              // user input

        [Required]
        [MaxLength(150)]
        public string Email { get; set; }                 // user input

        [Required]
        public string PasswordHash { get; set; }          // system generated — BCrypt hash

        [Required]
        [MaxLength(20)]
        public string Role { get; set; }                  // from list — Client | Admin
    }

}