using Microsoft.EntityFrameworkCore;
using SirpoLR3Charter.DataAccess;
using SirpoLR3Charter.Interfaces;
using SirpoLR3Charter.Models;
using System.Globalization;

namespace SirpoLR3Charter.Services
{
    public class CharterService : ICharterService
    {
        private readonly ChartersDbContext _context;

        public CharterService(ChartersDbContext context)
        {
            _context = context;
        }

        public async Task AddCharter(string citiesPath, int price, string date)
        {
            DateTime charterDateTime;

            if (!DateTime.TryParse(date, out charterDateTime))
            {
                throw new ArgumentException("Invalid date format");
            }


            charterDateTime = DateTime.SpecifyKind(charterDateTime, DateTimeKind.Utc);

            var charter = new Charter()
            {
                CititesPath = citiesPath,
                Price = price,
                CharterDateTime = charterDateTime, 
                CreatedAt = DateTime.UtcNow 
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
