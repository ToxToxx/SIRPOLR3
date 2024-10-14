using Microsoft.EntityFrameworkCore;
using SirpoLR3Charter.DataAccess;
using SirpoLR3Charter.Interfaces;
using SirpoLR3Charter.Models;

namespace SirpoLR3Charter.Services
{
    public class CharterService : ICharterService
    {
        private readonly ChartersDbContext _context;

        public CharterService(ChartersDbContext context)
        {
            _context = context;
        }

        public async Task AddCharter(string citiesPath, int price, DateTime date)
        {
            var charter = new Charter()
            {
                CititesPath = citiesPath,
                Price = price,
                CharterDateTime = date,
                CreatedAt = DateTime.Now
            };

            _context.Charters.Add(charter);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Charter>> GetAllCharts()
        {
            return await _context.Charters.ToListAsync();
        }
    }
}
