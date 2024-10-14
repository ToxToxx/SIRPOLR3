using Microsoft.EntityFrameworkCore;
using SirpoLR3Charter.Models;


namespace SirpoLR3Charter.DataAccess
{
    public class ChartersDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public ChartersDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public DbSet<Charter> Charters => Set<Charter>();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_configuration.GetConnectionString("Database"));
        }
    }
}
