using SirpoLR3Charter.Interfaces;
using SirpoLR3Charter.Models;

namespace SirpoLR3Charter.Services
{
    public class CharterService : ICharterService
    {
        public Task AddCharter(string citiesPath, int Price, DateTime date)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Charter>> GetAllCharts()
        {
            throw new NotImplementedException();
        }
    }
}
