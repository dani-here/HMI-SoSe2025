using LLMWrapper.DBContext;
using LLMWrapper.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// controllers
builder.Services.AddControllers();

// appsettings (latin square data)
builder.Services.Configure<List<List<string>>>(builder.Configuration.GetSection("LatinSquareSequences"));
builder.Services.Configure<LLMConfig>(builder.Configuration.GetSection("LLMConfig"));

// database
builder.Services.AddDbContext<StudyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// for gpt api
builder.Services.AddHttpClient();

// swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

var app = builder.Build();

// auto-migration on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<StudyDbContext>();
    db.Database.Migrate(); // applying all pending migrations
}

// middleware pipeline
//app.UseHttpsRedirection(); // no cert atm
app.UseRouting();

// enabling CORS
app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
);

// controllers to API
app.MapControllers();

// swagger (development only)
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1"));
//}

app.Run();